import {IconType} from "react-icons";

export type Service = {
  id: string;
  title: string;
  description: string;
  icon: IconType;
  transformValues: string;
}

type ServiceCardProps = {
  service: Service;
}

export default function ServiceCard({service}: ServiceCardProps) {
  const {title, description, icon, transformValues} = service;

  return (
    <div className="p-5 sm:p-6 lg:p-8 rounded-3xl bg-gray-100 dark:bg-gray-900 bg-opacity-60 dark:bg-opacity-35 overflow-hidden backdrop-blur-2xl hover:scale-110 transition-all"
         style={{transformOrigin: transformValues}}
    >
      <div className="rounded-xl bg-gray-200 dark:bg-gray-800 p-3 text-gray-900 dark:text-white w-max">
        {icon({size: 24})}
      </div>
      <div className="mt-4 space-y-2">
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
