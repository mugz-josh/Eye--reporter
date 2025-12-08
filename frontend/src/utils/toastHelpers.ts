interface ToastConfig {
  title: string;
  description: string;
  variant?: 'default' | 'destructive';
}

export function createToastConfig(
  title: string,
  description: string,
  variant: 'default' | 'destructive' = 'default'
): ToastConfig {
  return { title, description, variant };
}

export function errorToast(description: string, title: string = 'Error'): ToastConfig {
  return createToastConfig(title, description, 'destructive');
}

export function successToast(description: string, title: string = 'Success'): ToastConfig {
  return createToastConfig(title, description, 'default');
}

export function warningToast(description: string, title: string = 'Warning'): ToastConfig {
  return createToastConfig(title, description, 'destructive');
}
