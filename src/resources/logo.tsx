import {SVGProps} from "react";

export default function Logo(props: SVGProps<SVGSVGElement>){
  return (
    <svg width="101" height="115" viewBox="0 0 101 115" fill="none" {...props}>
      <path d="M0 4V115L21 101V17L0 4Z" fill="currentColor"/>
      <path d="M33 78.5V53.5L68 28V53.5L33 78.5Z" fill="currentColor"/>
      <path d="M58 88L101 115V0L82 13.5V65C82 75.5 69.6547 83.8103 58 88Z" fill="currentColor"/>
    </svg>
  )
}
