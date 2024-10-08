import AgreementForm from './AgreementForm';
import { func } from 'prop-types';

SignUpList.propTypes = {
  sendDataToParent: func,
};

function SignUpList({ sendDataToParent }) {
  const agreements = [
    {
      title: '[필수] 개인정보 수집 및 이용 동의',
      content:
        '입력한 별명, 프로필 사진, 하는 일, 프로필 키워드, 성별, 연령, 회사, 학교, 자격은 파티모집 서비스 내 프로필 페이지, 답변자 정보 영역, 파티모집 홈 및 서비스 내 프로필 공개를 목적으로 합니다.',
      info: '수집된 정보는 언제든지 직접 삭제할 수 있고, 탈퇴 시에는 바로 파기됩니다.',
      showButton: true,
    },
    {
      title: '[필수] 프로필 정보 노출 영역 확인',
      content:
        '입력한 프로필 정보는 다른 사용자들이 파티모집 서비스 내에서 확인할 수 있으며, 파티모집 홈, 검색 결과 및 답변자 정보 영역에 노출됩니다. 노출되는 정보는 설정을 통해 일부 비공개로 전환할 수 있습니다.',
      info: '프로필 노출 정보는 서비스 내 설정에서 언제든지 수정 가능하며, 비공개 설정을 통해 일부 정보를 노출하지 않을 수 있습니다.',
      showButton: true,
    },
    {
      title: '[필수] 위치기반 서비스 이용약관 동의',
      content:
        '위치 기반 서비스를 사용하여 사용자의 현재 위치를 기준으로 주변의 파티를 추천하고, 위치에 따른 맞춤형 콘텐츠를 제공하기 위해 위치 정보를 수집합니다.',
      info: '수집된 위치 정보는 파티 추천 및 맞춤형 서비스 제공 외의 목적으로 사용되지 않으며, 설정에서 언제든지 위치 정보 수집을 중단할 수 있습니다.',
      showButton: true,
    },
    {
      title:
        '[필수] 사실과 다른 정보를 기재하여 발생한 문제에 대해서는 본인이 일체의 책임을 부담하겠습니다.',
      content:
        '사용자가 제공한 정보는 정확하고 사실이어야 하며, 허위 정보를 기재하여 발생한 문제는 전적으로 사용자 본인의 책임입니다.',
      info: '허위 정보로 인한 서비스 이용 제한, 법적 책임 발생 등에 대해 회사는 일체의 책임을 지지 않으며, 사실 확인을 위한 자료 제출을 요구할 수 있습니다.',
      showButton: false,
    },
  ];

  return (
    <AgreementForm
      agreements={agreements}
      sendDataToParent={sendDataToParent}
    />
  );
}

export default SignUpList;
