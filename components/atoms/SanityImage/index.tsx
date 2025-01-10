import urlBuilder from "@sanity/image-url";
import { client } from "@/sanity/client";
import Image from "next/image";

type SampleImageComponentProps = {
  value: {
    _type: string;
    _key: string;
    asset: {
      _type: string;
      _ref: string;
    };
  };
};

export default function SampleImageComponent({
  value,
}: SampleImageComponentProps) {
  return (
    <Image
      src={urlBuilder(client)
        .image(value)
        // .width(500)
        .fit("max")
        .auto("format")
        .url()}
      alt={value._key}
      width={500}
      height={500}
      className="w-full h-auto"
    />
  );
}
