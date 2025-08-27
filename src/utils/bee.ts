import { Bee, Reference, Topic } from "@ethersphere/bee-js";
import { BEE_API_URL, FEED_OWNER_ADDRESS, MAINNET_PK } from "../config";

export const initFeed = async (
  rawTopic: string,
  stamp: string
): Promise<Reference | null> => {
  try {
    const bee = new Bee(BEE_API_URL);
    const topicBytes = Topic.fromString(rawTopic);

    const feedManifest = await bee.createFeedManifest(
      stamp,
      topicBytes,
      FEED_OWNER_ADDRESS
    );
    console.log("created feed manifest", feedManifest.toHex());

    return feedManifest;
  } catch (error) {
    console.log("error creating feed manifest", error);
    return null;
  }
};

export const updateFeed = async (
  rawTopic: string,
  stamp: string,
  uploadReference: Reference
): Promise<Reference | null> => {
  if (!MAINNET_PK) {
    console.log("mainnet_pk is missing");
    return null;
  }

  try {
    const bee = new Bee(BEE_API_URL);
    const topicBytes = Topic.fromString(rawTopic);

    const feedWriter = bee.makeFeedWriter(topicBytes, MAINNET_PK);
    const uploadReferenceResult = await feedWriter.uploadReference(
      stamp,
      uploadReference
    );

    console.log("upload reference: ", uploadReferenceResult.reference.toHex());
    return uploadReferenceResult.reference;
  } catch (error) {
    console.log("error updating the feed", error);
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

