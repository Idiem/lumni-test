import { FormEvent, useState } from 'react';
import styles from './LoginManager.module.css';
import { loginWithEmailAndPassword } from '../Api/LoginApi';
import useAppState from '../AppState/useAppState';
import Input from '../Fields/Input';
import ButtonWithLoading from '../ButtonWithLoading';
import emailRegex from '@presentation/regexes/emailRegex';

export interface ILoginManagerProps {
  onLoginSuccess?: () => void;
  onLoginFail?: () => void;
  onError?: () => void;
  onManyAttempts?: () => void;
}

const LoginManager = (props: ILoginManagerProps) => {
  const { storeSessionState } = useAppState();
  const [loading, setLoading] = useState(false);
  const [inputEmail, setInputEmail] = useState<string | undefined>('');
  const [inputPassword, setInputPassword] = useState<string | undefined>('');

  const callLoginApi = async (email: string, password: string) => {
    setLoading(true);
    const response = await loginWithEmailAndPassword({
      email: email.trim(),
      password: password.trim(),
    });
    setLoading(false);

    if (response.status === 401) {
      props.onLoginFail && props.onLoginFail();
    } else if (!response.isSuccess) {
      props.onError && props.onError();
    } else if (response.status === 409) {
      props.onManyAttempts && props.onManyAttempts();
    } else {
      storeSessionState({ isLogin: true, ...response.body });
      props.onLoginSuccess && props.onLoginSuccess();
    }
  };

  const validateForm = () => {
    console.log(inputEmail, inputPassword);
    return inputEmail && inputPassword && inputEmail.trim().match(emailRegex);
  };

  const onSubmit = (evt: FormEvent) => {
    if (!validateForm()) {
      return props.onLoginFail && props.onLoginFail();
    }

    evt.preventDefault();
    callLoginApi(inputEmail!, inputPassword!);
  };

  const handleChange = (evt: FormEvent) => {
    switch ((evt.target as HTMLInputElement).name) {
      case 'email':
        setInputEmail((evt.target as HTMLInputElement).value);
        break;
      case 'password':
        setInputPassword((evt.target as HTMLInputElement).value);
        break;
    }
  };

  return (
    <section className={styles.root}>
      <h1>Inicia sesión</h1>
      <form onSubmit={onSubmit} className={styles.form}>
        <h2>Inicia sesión con tu usuario y contraseña</h2>
        <div className={styles.box}>
          <label htmlFor="email">Correo electrónico</label>
          <Input
            variant="filled"
            id="email"
            name="email"
            type="email"
            autofocus
            value={inputEmail}
            onChange={handleChange}
          />
        </div>
        <div className={styles.box}>
          <label htmlFor="password">Contraseña</label>
          <Input
            variant="filled"
            id="password"
            name="password"
            type="password"
            value={inputPassword}
            onChange={handleChange}
          />
        </div>
        <ButtonWithLoading
          loading={loading}
          disabled={loading || !validateForm()}
          variant="contained"
          className={styles.submitButton}
          color="primary"
          type="submit"
        >
          Iniciar sesión
        </ButtonWithLoading>
      </form>
    </section>
  );
};

export default LoginManager;
