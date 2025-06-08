export type TLoginAuth = {
  name: string;
  password: string;
};

export type TPhoto = {
  fileId: string;
  name: string;
  url: string;
  thumbnailUrl: string;
};

export type TUser = {
  name: string;
  designation: string;
  linkedInUrl: string;
  writeUp: string;
  password: string;
  photo?: TPhoto;
  station : string;
};
