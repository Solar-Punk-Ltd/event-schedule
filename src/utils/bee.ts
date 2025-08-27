import { Bee, Bytes, Reference } from "@ethersphere/bee-js";
import { BEE_API_URL, FEED_OWNER_ADDRESS, MAINNET_PK } from "../config";

export const updateFeed = async (
  topic: string,
  stamp: string,
  uploadReference: Reference
): Promise<Reference | null> => {
  try {
    const bee = new Bee(BEE_API_URL);
    const topicBytes = Bytes.keccak256(Bytes.fromUtf8(topic));

    const feedManifest = await bee.createFeedManifest(
      stamp,
      topicBytes,
      FEED_OWNER_ADDRESS
    );
    console.log("created feed manifest", feedManifest.toHex());
    if (!MAINNET_PK) {
      console.log("mainnet_pk is missing");
      return null;
    }

    const feedWriter = bee.makeFeedWriter(topicBytes, MAINNET_PK);
    const uploadReferenceResult = await feedWriter.uploadReference(
      stamp,
      uploadReference
    );

    console.log("upload reference: ", uploadReferenceResult.reference.toHex());
    return uploadReferenceResult.reference;
  } catch (error) {
    console.log("error creating feed manifest", error);
    return null;
  }
};

export async function uploadData(
  stamp: string,
  data: string | Uint8Array
): Promise<Reference | null> {
  try {
    const bee = new Bee(BEE_API_URL);
    console.log("uploading data to swarm");
    const sessionsReference = await bee.uploadData(stamp, data);

    return sessionsReference.reference;
  } catch (error) {
    console.log("error data upload", error);
    return null;
  }
}
