import ImageKit from "imagekit";
import config from "./index";

const imageKt = new ImageKit({
    urlEndpoint: config.urlEndpoint as string,
    publicKey: config.publicKey as string,
    privateKey: config.privateKey as string,
});

export default imageKt;
