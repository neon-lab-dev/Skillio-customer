export type TLoginAuth = {
  email: string;
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
  email: string;
  designation: string;
  linkedInUrl: string;
  writeUp: string;
  password: string;
  photo?: TPhoto | null;
  station : string;
  role: "ADMIN" | "USER";
};

export type Tpeople = {
  name: string;
  email: string;
  designation: string;
  linkedInUrl: string;
  writeUp: string;
  photo?: TPhoto | null ;
  station : string;
};
