import S from './BoardDetail.module.css';
import Header from '@/components/App/Header';
import Badge from '@/components/Badge/Badge';
import OptionPopup from '@/components/OptionPopup/OptionPopup';
import SendMessage from '@/components/SendMessage/SendMessage';
import CommentsList from '@/components/CommentsList/CommentsList';
import useListStore from '@/stores/useListStore';
import { supabase } from '@/api/supabase';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { formatDateWithTime } from '@/utils/formatDate';
import Fallback from '@/pages/Fallback';
import Error from '@/pages/Error';
import NoneData from '@/pages/NoneData';
import toast from 'react-hot-toast';
import PropTypes from 'prop-types';

function BoardDetail() {
  const [isLiked, setIsLiked] = useState(false);
  const [isOptionPopupActive, setIsOptionPopupActive] = useState(false);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [commentsError, setCommentsError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const { singleData, error, isLoading, fetchData } = useListStore();

  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const encodedId = query.get('q');
  const id = atob(encodedId);

  useEffect(() => {
    fetchData('board', id);
    fetchCurrentUser();
  }, [id, fetchData]);

  const fetchCurrentUser = async () => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error) {
      console.error('Error fetching current user:', error);
    } else {
      setCurrentUser(user);
    }
  };

  const fetchComments = useCallback(async () => {
    if (!singleData || !singleData.id) return;

    setLoadingComments(true);
    try {
      const { data, error } = await supabase
        .from('board_comment')
        .select(
          `
            id,
            comment,
            create_at,
            users:user_id (username)
          `
        )
        .eq('board_id', singleData.id)
        .order('create_at', { ascending: true });

      if (error) throw error;

      const processedData = data.map((comment) => ({
        ...comment,
        id: comment.id.toString(),
      }));

      setComments(processedData);
    } catch (error) {
      console.error('Error fetching comments:', error);
      setCommentsError('댓글을 불러오는 데 실패했습니다.');
    } finally {
      setLoadingComments(false);
    }
  }, [singleData]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSendMessage = useCallback(
    async (message) => {
      try {
        const { data: userData, error: userError } =
          await supabase.auth.getUser();
        if (userError) throw userError;

        const { data, error } = await supabase
          .from('board_comment')
          .insert({
            board_id: singleData.id,
            user_id: userData.user.id,
            comment: message,
          })
          .select('id, comment, create_at, users:user_id (username)')
          .single();

        if (error) throw error;

        setComments((prevComments) => [
          ...prevComments,
          { ...data, id: data.id.toString() },
        ]);

        toast.success('댓글이 성공적으로 작성되었습니다.');
      } catch (error) {
        console.error('Error sending comment:', error);
        toast.error('댓글 작성에 실패했습니다.');
      }
    },
    [singleData]
  );

  const handleLikeButton = () => {
    console.log('저장 버튼 클릭');
    setIsLiked((prevState) => !prevState);
  };

  const handleExportButton = () => {
    console.log('내보내기 버튼 클릭');
  };

  const menuOptions = useMemo(() => {
    const handleEdit = () => {
      navigate(`/board/write?edit=${encodedId}`);
    };

    const handleDelete = async () => {
      if (!window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) return;

      try {
        const { error } = await supabase
          .from('board')
          .delete()
          .eq('id', singleData.id);

        if (error) throw error;

        toast.success('게시글이 성공적으로 삭제되었습니다.');
        navigate('/board');
      } catch (error) {
        console.error('Error deleting post:', error);
        toast.error('게시글 삭제 중 오류가 발생했습니다.');
      }
    };

    const options = [];
    if (currentUser && singleData && currentUser.id === singleData.user_id) {
      options.push({ label: '수정하기', onClick: handleEdit });
      options.push({
        label: '삭제하기',
        onClick: handleDelete,
      });
    }
    return options;
  }, [currentUser, singleData, navigate, encodedId]);

  const handleOptionButton = () => {
    console.log('옵션 버튼 클릭');
    setIsOptionPopupActive((prevState) => !prevState);
  };

  if (isLoading) return <Fallback />;
  if (error) return <Error />;
  if (!singleData) return <NoneData />;

  const formattedDate = formatDateWithTime(singleData.create_at);

  return (
    <>
      <Header
        back={true}
        actions={[
          {
            icon: isLiked ? 'i_like_filled' : 'i_like_line',
            onClick: handleLikeButton,
          },
          { icon: 'i_export', onClick: handleExportButton },
          ...(menuOptions.length > 0
            ? [{ icon: 'i_option', onClick: handleOptionButton }]
            : []),
        ]}
      />
      {isOptionPopupActive && <OptionPopup options={menuOptions} />}
      <main className={S.boardDetail}>
        <section className={S.post}>
          <header className={S.postHeader}>
            <Badge text="자유게시판" variant="category"></Badge>
            <h2 className="hdg-lg">{singleData.title}</h2>
          </header>
          <div className={S.postContent}>
            <ul className="para-md">
              <li aria-label="작성일">
                <span aria-hidden="true" className="i_calendar_filled"></span>
                <span>{formattedDate}</span>
              </li>
              <li aria-label="작성자">
                <span aria-hidden="true" className="i_people_filled"></span>
                <span>{singleData.username}</span>
              </li>
            </ul>
            <p className="para-md">{singleData.content}</p>
            {singleData.board_img && (
              <div className={S.boardImage}>
                <img src={singleData.board_img} alt="게시글 이미지" />
              </div>
            )}
          </div>
          {loadingComments ? (
            <p>댓글을 불러오는 중...</p>
          ) : commentsError ? (
            <p>{commentsError}</p>
          ) : (
            <CommentsList comments={comments} />
          )}
        </section>
        <SendMessage onSendMessage={handleSendMessage} />
      </main>
    </>
  );
}

BoardDetail.propTypes = {
  isLiked: PropTypes.bool,
  isOptionPopupActive: PropTypes.bool,
  comments: PropTypes.array,
  loadingComments: PropTypes.bool,
  commentsError: PropTypes.string,
  currentUser: PropTypes.object,
  singleData: PropTypes.object,
  error: PropTypes.object,
  isLoading: PropTypes.bool,
};

export default BoardDetail;
