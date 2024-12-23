import { IconType } from "react-icons";

export type Service = {
  id: string;
  title: string;
  description: string;
  icon: IconType;
  transformValues: string;
};

type ServiceCardProps = {
  service: Service;
};

export default function ServiceCard({ service }: ServiceCardProps) {
  const { title, description, icon, transformValues } = service;

  return (
    <div
      className="overflow-hidden rounded-3xl bg-gray-100 bg-opacity-60 p-5 backdrop-blur-2xl transition-all hover:scale-110 sm:p-6 lg:p-8 dark:bg-gray-900 dark:bg-opacity-35"
      style={{ transformOrigin: transformValues }}
    >
      <div className="w-max rounded-xl bg-gray-200 p-3 text-gray-900 dark:bg-gray-800 dark:text-white">
        {icon({ size: 24 })}
      </div>
      <div className="mt-4 space-y-2">
        <h2 className="text-lg font-semibold text-gray-900 md:text-xl dark:text-gray-100">
          {title}
        </h2>
        <p className="text-gray-700 dark:text-gray-300">{description}</p>
      </div>
    </div>
  );
}
