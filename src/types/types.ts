export type CreateRoomType = {
  name: string;
  logoURL: string;
  isPrivate: boolean;
  roomPassword: string;
};

export interface ExtendedError extends Error {
  statusCode: number;
}
