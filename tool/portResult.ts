export interface PortResultType<T> {
  status: 'fail' | 'error' | 'success',
  message: string,
  code: number,
  data?: T,
}

export const portResult = {
  fail<T>(msg = '', data?: T): PortResultType<T> {
    return { status: 'fail', message: msg, code: 400, data };
  },
  success<T>(msg = '', data?: T): PortResultType<T> {
    return { status: 'success', message: msg, code: 200, data };
  },
  error<T>(msg = '', data?: T): PortResultType<T> {
    return { status: 'error', message: msg, code: 500, data };
  },
  info<T>(msg = '', code: number, data?: T): PortResultType<T> {
    return { status: 'error', message: msg, code, data };
  },
};
