interface KeysInterface {
  serverUrl: string;
  serverAuth: {
    username: string;
    password: string;
  };
}

export const Keys = (): KeysInterface => ({
  serverUrl: process.env.NEXT_PUBLIC_SERVER_URI!,
  serverAuth: {
    username: process.env.NEXT_PUBLIC_SERVER_USERNAME!,
    password: process.env.NEXT_PUBLIC_SERVER_PASSWORD!,
  },
});

export default Keys;



