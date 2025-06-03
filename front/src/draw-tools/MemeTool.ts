import { AssetRecordType, StateNode, type TLImageAsset } from "tldraw";

import { BACKEND_URL } from "../utils/env";

const PROMPT_URL = `${BACKEND_URL}/memes/generateFromPrompt`;
const ASSET_URL = `${BACKEND_URL}/sync/uploads`;

const getImageMeta = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = url;
  });

export class MemeTool extends StateNode {
  static override id = 'meme-tool'

  override async onEnter({ message }: { message: string }) {
    const response = await fetch(PROMPT_URL, {
      method: 'POST',
      body: message
    });

    if (response.ok) {

      //Getting image metadata by using a HTMLImageElement
      const fileId = (await response.json()).id as string;
      const imageUrl = `${ASSET_URL}/${fileId}`;
      const imageMetadata = await getImageMeta(imageUrl);
      const imageHeight = imageMetadata.height;
      const imageWidth = imageMetadata.width;

      let ratio: number;
      if (imageHeight / window.innerHeight > imageWidth / window.innerWidth) {
        ratio = window.innerHeight / (2 * imageHeight);
      } else {
        ratio = window.innerWidth / (2 * imageWidth);
      }

      const assetId = AssetRecordType.createId();
      const image: TLImageAsset = {
        id: assetId,
        type: "image",
        typeName: 'asset',
        props: {
          h: imageHeight,
          isAnimated: false,
          mimeType: "image/png", // TBC mime type
          name: "myImage.png",
          src: imageUrl,
          w: imageWidth,
        },
        meta: {}
      };

      this.editor.createAssets([image])

      console.log(ratio);

      this.editor.createShape({
        type: 'image',
        x: (window.innerWidth - imageWidth * ratio) / 2,
        y: (window.innerHeight - imageHeight * ratio) / 2,
        props: {
          assetId: assetId,
          w: imageWidth * ratio,
          h: imageHeight * ratio,
          url: imageUrl,
        },
      })
    } else {
      alert(`Error while calling Meme : ${response.status}, ${await response.text()})`);
    }
    this.editor.setCurrentTool("hand");
  }
}