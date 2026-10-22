// Auth pages: login + register with validation, JWT session via Zustand.
import { Form, Input, Button, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useLogin, useRegister } from '../entities/use-content.js';
import { apiErrorMessage } from '../shared/mock-api.js';

export function LoginPage() {
  const login = useLogin();
  const navigate = useNavigate();
  return (
    <main className="page"><div className="card auth-wrap">
      <span className="eyebrow">С возвращением</span><h1>Вход</h1>
      <p>Демо: donor@sadaka.kg · sadaka123</p>
      <Form layout="vertical" onFinish={async (v) => { try { await login.mutateAsync(v); message.success('Добро пожаловать!'); navigate('/families'); } catch (e) { message.error(apiErrorMessage(e)); } }}>
        <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Введите email' }, { type: 'email', message: 'Похоже, не email' }]}><Input size="large" /></Form.Item>
        <Form.Item name="password" label="Пароль" rules={[{ required: true, message: 'Введите пароль' }, { min: 6, message: 'Минимум 6 символов' }]}><Input.Password size="large" /></Form.Item>
        <Button type="primary" htmlType="submit" block size="large" loading={login.isPending}>Войти</Button>
      </Form>
      <p>Нет аккаунта? <Link to="/register">Зарегистрироваться</Link></p>
    </div></main>
  );
}

export function RegisterPage() {
  const register = useRegister();
  const navigate = useNavigate();
  return (
    <main className="page"><div className="card auth-wrap">
      <span className="eyebrow">Присоединяйтесь</span><h1>Регистрация</h1>
      <Form layout="vertical" onFinish={async (v) => { try { await register.mutateAsync(v); message.success('Аккаунт создан!'); navigate('/families'); } catch (e) { message.error(apiErrorMessage(e)); } }}>
        <Form.Item name="name" label="Имя" rules={[{ required: true, message: 'Как к вам обращаться?' }]}><Input size="large" /></Form.Item>
        <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Введите email' }, { type: 'email', message: 'Похоже, не email' }]}><Input size="large" /></Form.Item>
        <Form.Item name="password" label="Пароль" rules={[{ required: true, message: 'Придумайте пароль' }, { min: 6, message: 'Минимум 6 символов' }]}><Input.Password size="large" /></Form.Item>
        <Button type="primary" htmlType="submit" block size="large" loading={register.isPending}>Создать аккаунт</Button>
      </Form>
      <p>Уже с нами? <Link to="/login">Войти</Link></p>
    </div></main>
  );
}
