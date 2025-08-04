import ChangePasswordModal from '@/app/(shared)/components/ChangePasswordModal';
import ChangePhoneModal from '@/app/(shared)/components/ChangePhoneModal';
import ChangeNicknameModal from '@/app/(shared)/components/ChangeNicknameModal';
import SocialLoginModal from '@/app/(shared)/components/SocialLoginModal';
import ServiceGuideModal from '@/app/(shared)/components/ServiceGuideModal';
import PrivacyPolicyModal from '@/app/(shared)/components/PrivacyPolicyModal';
import ThemeModal from '@/app/(shared)/components/ThemeModal';
import FavoriteListModal from '@/app/(shared)/components/FavoriteListModal';
import { useModalStore } from '@/app/(shared)/stores/modal-store';
import { FavoriteItem } from '@/app/(shared)/types/mypage';
import { UserProfile } from '@/app/(shared)/types/user-store';

interface MyPageModalsProps {
  profile: UserProfile | null;
  favorites: FavoriteItem[];
  onUpdateNickname: (nickname: string) => void;
  onFetchUserProfile: () => void;
  onDeleteFavorite: (memberId: number, nickname: string) => Promise<void>;
}

export default function MyPageModals({
  profile,
  favorites,
  onUpdateNickname,
  onFetchUserProfile,
  onDeleteFavorite,
}: MyPageModalsProps) {
  const { isOpen, modalType, closeModal } = useModalStore();

  return (
    <>
      <ChangePasswordModal
        open={isOpen && modalType === 'change-password'}
        onClose={closeModal}
        onSubmit={() => {
          // 비밀번호 변경 성공 시 모달 닫기
          closeModal();
        }}
      />
      <ChangePhoneModal
        open={isOpen && modalType === 'change-phone'}
        onClose={closeModal}
        onSubmit={() => {
          // 전화번호 변경 성공 시 모달 닫기
          closeModal();
        }}
      />
      <ServiceGuideModal
        open={isOpen && modalType === 'service-guide'}
        onClose={closeModal}
      />
      <PrivacyPolicyModal
        open={isOpen && modalType === 'privacy-policy'}
        onClose={closeModal}
      />
      <SocialLoginModal
        open={isOpen && modalType === 'social-login'}
        onClose={closeModal}
        onSubmit={() => {
          // 소셜 로그인 연동/해제 성공 시 사용자 프로필 새로고침
          onFetchUserProfile();
          // 모달은 닫지 않고 계속 열어둠 (사용자가 다른 계정도 연동/해제할 수 있도록)
        }}
      />
      <ChangeNicknameModal
        open={isOpen && modalType === 'change-nickname'}
        onClose={closeModal}
        currentNickname={profile?.nickname || ''}
        onSubmit={(nickname) => {
          onUpdateNickname(nickname);
          // 닉네임 변경 성공 시 모달 닫기
          closeModal();
        }}
      />
      <FavoriteListModal
        open={isOpen && modalType === 'favorite-list'}
        onClose={closeModal}
        favorites={favorites.map((fav) => ({
          memberId: fav.memberId,
          nickname: fav.nickname,
        }))}
        onDelete={onDeleteFavorite}
      />
      <ThemeModal open={isOpen && modalType === 'theme'} onClose={closeModal} />
    </>
  );
}
