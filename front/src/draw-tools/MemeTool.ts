import { AssetRecordType, StateNode, type TLImageAsset } from "tldraw";

import { BACKEND_URL } from "../utils/env";

const WORKER_URL = `${BACKEND_URL}/memes/generateFromPrompt`;


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
        const response = await fetch(WORKER_URL, {
            method: 'POST',
            body: message
        });

        if (response.ok) {
            const assetId = AssetRecordType.createId()

            //Getting image metadata by using a HTMLImageElement
            const url = await response.text();
            const imageMetadata = await getImageMeta(url);
            let imageHeight = imageMetadata.height;
            let imageWidth = imageMetadata.width;

            //Calculate ratio to apply based on relatively largest side
            let ratio: number;
            if (imageHeight / window.innerHeight > imageWidth / window.innerWidth) {
                ratio = window.innerHeight / (2 * imageHeight);
            } else {
                ratio = window.innerWidth / (2 * imageWidth);
            }
            imageHeight *= ratio;
            imageWidth *= ratio;

            //Create image asset
            //Doesn't upload the asset.
            const image: TLImageAsset = {
                id: assetId,
                type: "image",
                typeName: 'asset',
                props: {
                    h: imageHeight,
                    isAnimated: false,
                    mimeType: "image/png", // TBC mime type
                    name: "myImage.png",
                    src: await response.text(), // TODO, url ou base64 OK
                    w: imageWidth,
                },
                meta: {}
            };

            this.editor.createAssets([image])

            //Display the asset
            this.editor.createShape({
                type: 'image',
                // Let's center the image in the editor
                x: (window.innerWidth - imageWidth) / 2,
                y: (window.innerHeight - imageHeight) / 2,
                props: {
                    assetId,
                    w: imageWidth,
                    h: imageHeight,
                },
            })
        } else {
            alert(`Error while calling Meme : ${response.status}, ${await response.text()})`);
        }
    }
}