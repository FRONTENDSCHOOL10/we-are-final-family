import S from './Register.module.css';
import ValidationInput from '@/components/ValidationInput/ValidationInput';
import Button from '@/components/Button/Button';
import { createData } from '@/api/DataService';
import useRegisterStore from '@/stores/useRegisterStore';
import { supabase } from '@/api/supabase';
import Modal from '@/components/Modal/Modal';
import { validateEmail, validatePassword } from '@/utils/validation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';

const signUp = async (email, password, username) => {
  try {
    console.log('Starting sign up process for email:', email);

    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });
    if (error) {
      toast.error('동일한 이메일이 존재합니다.');
      throw error;
    } else if (data.user && data.user.id) {
      console.log(
        'Attempting to insert user into public.users. User ID:',
        data.user.id
      );
    }
    await createData({
      from: 'users',
      values: { id: data.user.id, email: email, username: username },
    });
    return data.user.id;
  } catch (error) {
    console.error('Error in signUp process:', error);
    throw error;
  }
};

const saveInterests = async (userId) => {
  try {
    const interestData = localStorage.getItem('interest-storage');
    let interests = [];

    if (interestData) {
      const parsedData = JSON.parse(interestData);
      interests = parsedData.state.savedInterests || [];
    }

    const interestValues = {
      id: userId,
      interest_1: interests[0]?.name || null,
      interest_2: interests[1]?.name || null,
      interest_3: interests[2]?.name || null,
      interest_4: interests[3]?.name || null,
      interest_5: interests[4]?.name || null,
      interest_6: interests[5]?.name || null,
    };

    await createData({
      from: 'interest_selected',
      values: interestValues,
    });

    console.log('Interests saved successfully');
  } catch (error) {
    console.error('Error saving interests:', error);
  }
};

const clearLocalStorage = () => {
  localStorage.clear();
};

function Register() {
  const { email, password, username, setEmail, reset, setPassword, setName } =
    useRegisterStore();
  const [active, setActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (isLoading) return; // 이미 로딩 중이면 함수 실행을 중단

    try {
      setIsLoading(true); // 로딩 시작
      const userId = await signUp(email, password, username);
      await saveInterests(userId);
      reset();
      clearLocalStorage();
      setActive(true);
      toast.success('회원가입이 완료되었습니다.');
    } catch (error) {
      console.error('회원가입 중 오류가 발생했습니다:', error);
    } finally {
      setIsLoading(false); // 로딩 종료
    }
  };

  const isFormValid =
    validateEmail(email) === '' &&
    validatePassword(password) === '' &&
    username;

  return (
    <main className={S.register}>
      <div>
        <Toaster />
      </div>
      <header>
        <h1 className="hdg-lg">
          안녕하세요.
          <br />
          파티구함에 처음 오셨나요?
        </h1>
        <p className="para-md">아래 양식에 맞게 새로 가입해주세요.</p>
      </header>
      <form className={S.body}>
        <ValidationInput
          type="email"
          label="이메일"
          info="이메일을 입력해주세요"
          onChange={setEmail}
        />
        <ValidationInput
          type="pw"
          label="비밀번호"
          info="비밀번호를 입력해주세요"
          onChange={setPassword}
        />
        <ValidationInput
          type="normal"
          label="이름(별명)"
          info="이름(별명)을 입력해주세요."
          onChange={setName}
        />
      </form>
      <footer>
        <Button
          color="black"
          aria-label="회원가입"
          onClick={handleSubmit}
          disabled={!isFormValid || isLoading}
        >
          {isLoading ? '처리 중...' : '회원가입'}
        </Button>
        <div
          style={{
            display: active ? 'block' : 'none',
          }}
        >
          <Modal
            title="인증 메일 발송"
            desc={`인증메일이 발송되었습니다.\n 입력하신 메일로 돌아가 \n인증을 완료해주세요`}
            buttons={[
              {
                type: 'submit',
                to: '/login',
                color: 'black',
                label: '확인',
                action: 'confirm',
              },
            ]}
          />
        </div>
      </footer>
    </main>
  );
}

export default Register;
