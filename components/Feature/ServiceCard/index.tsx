import styles from "./index.module.scss";

const iconRender = (val: string) => {
  switch (val) {
    case "send":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"/>
        </svg>
      )
    default:
      return <>No Icon</>;
  }
}

type ServiceCardProps = {
  title: string;
  description: string;
  icon: string;
  transformValues: string;
}

export default function ServiceCard({title, description, icon, transformValues}: ServiceCardProps) {
  return (
    <div className="p-5 sm:p-6 lg:p-8 rounded-3xl bg-gray-100 dark:bg-gray-900 bg-opacity-60 dark:bg-opacity-35 relative overflow-hidden backdrop-blur-2xl hover:scale-110 transition-all"
         style={{transformOrigin: transformValues}}
    >
      <div className="rounded-xl bg-gray-200 dark:bg-gray-800 p-3 text-gray-900 dark:text-white w-max relative">
        {iconRender(icon)}
      </div>
      <div className="mt-6 space-y-4 relative">
        <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </h2>
        <p className="text-gray-700 dark:text-gray-300">
          {description}
        </p>
      </div>
    </div>
  )
}
