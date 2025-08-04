import { MockRequest } from '@delon/mock';

export const MOCKDATA = {
  'POST /login/account': (req: MockRequest) => {
    console.log('Mock interceptor called with:', req.body);
    const { userName, password, type } = req.body;

    // Handle admin login
    if (type === 0 && userName === 'admin' && password === '123456') {
      console.log('Admin login successful');
      return {
        msg: 'ok',
        user: {
          name: 'Admin User',
          avatar: './assets/tmp/img/avatar.jpg',
          email: 'admin@example.com',
          id: 'admin_001',
          token: `mock-admin-token-${Date.now()}`,
          time: +new Date(),
          roles: ['admin'],
          permissions: ['*']
        }
      };
    }

    // Handle user login
    if (type === 0 && userName === 'user' && password === '123456') {
      console.log('User login successful');
      return {
        msg: 'ok',
        user: {
          name: 'Regular User',
          avatar: './assets/tmp/img/avatar.jpg',
          email: 'user@example.com',
          id: 'user_001',
          token: `mock-user-token-${Date.now()}`,
          time: +new Date(),
          roles: ['user'],
          permissions: ['read']
        }
      };
    }

    console.log('Login failed - invalid credentials');
    // Invalid credentials
    return {
      msg: 'Invalid username or password'
    };
  }
};
