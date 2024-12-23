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

// Barebones lazy-loaded image component
export default function SampleImageComponent({
  value,
}: SampleImageComponentProps) {
  console.log(value);

  return (
    <Image
      src={urlBuilder(client)
        .image(value)
        .width(500)
        .fit("max")
        .auto("format")
        .url()}
      alt={value._key}
      // style={{
      //   // Avoid jumping around with aspect-ratio CSS property
      //   aspectRatio: width / height,
      // }}
      placeholder="blur"
      blurDataURL=""
      width={500}
      height={500}
    />
  );
}
// <PortableText
//   value={input}
//   components={{
//     // ...
//     types: {
//       image: SampleImageComponent,
//     },
//   }}
// />
