import UserRole from '@domain/models/UserRole';
import SplitPageLayout from '@view/common/SplitPageLayout/SplitPageLayout';
import { useEffect } from 'react';
import NotificationModal from '../NotificationModal/NotificationModal';
import { useNotificationModal } from '../NotificationModal/useNotificationModal';
import LoginPageDecorationSection from './LoginPageDecorationSection';
import styles from './LoginPage.module.css';
import { useRouter } from 'next/router';
import useAppState from '../AppState/useAppState';
import LoginManager from '../LoginManager';
import AppHeaderLayout from '../AppHeaderLayout';

const LoginPage = () => {
  const router = useRouter();
  const { sessionState } = useAppState();
  const { openNotificationModal, notificationModalProps } =
    useNotificationModal();

  const goToHome = () => {
    if (!sessionState?.isLogin) return;

    if (sessionState.roles.includes(UserRole.Staff)) {
      router.push('/admin');
    } else if (sessionState.roles.includes(UserRole.Student)) {
      router.push('/students');
    } else {
      openNotificationModal({
        variant: 'error',
        title: 'Error',
        description:
          'Lo sentimos no se pudo reconocer su tipo de usuario. Intenta iniciar sesión nuevamente.',
        actionLabel: 'Aceptar',
      });
    }
  };

  useEffect(() => {
    if (!sessionState?.isLogin) return;
    goToHome();
  }, [sessionState]);

  const onLoginFail = () => {
    openNotificationModal({
      variant: 'warning',
      title: 'Credenciales inválidas',
      description: 'Verifica el correo y contraseña ingresados',
    });
  };

  const onError = () => {
    openNotificationModal({
      variant: 'error',
      title: 'Error inesperado',
      description:
        'Lo sentimos ha currido un error inesperado en nuestros servicios',
    });
  };

  const onManyAttempts = () => {
    openNotificationModal({
      variant: 'error',
      title: 'Error inesperado',
      description:
        'Ha superado el número de intentos permitidos, por favor intente de nuevo más tarde',
    });
  };

  return (
    <AppHeaderLayout>
      <SplitPageLayout>
        <LoginPageDecorationSection />
        <div className={styles.formSection}>
          <LoginManager
            onLoginFail={onLoginFail}
            onError={onError}
            onManyAttempts={onManyAttempts}
          />
        </div>
      </SplitPageLayout>
      <NotificationModal {...notificationModalProps} />
    </AppHeaderLayout>
  );
};

export default LoginPage;
