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


const ServiceCard = ({title, description, icon, transformValues}: { title: string, description: string, icon: string, transformValues: string }) => {
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

const services = [
  {
    id: 1,
    title: "Social media marketing",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto deserunt culpa autem",
    icon: "send",
    transformValues: "100% 100%"
  },
  {
    id: 2,
    title: "Email marketing",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto deserunt culpa autem",
    icon: "send",
    transformValues: "50% 100%"
  },
  {
    id: 3,
    title: "Service 3",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto deserunt culpa autem",
    icon: "send",
    transformValues: "0% 100%"
  },
  {
    id: 4,
    title: "Email marketing",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto deserunt culpa autem",
    icon: "send",
    transformValues: "100% 0%"
  },
  {
    id: 5,
    title: "Service 4",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto deserunt culpa autem",
    icon: "send",
    transformValues: "50% 0%"
  },
  {
    id: 6,
    title: "Email marketing",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto deserunt culpa autem",
    icon: "send",
    transformValues: "0% 0%"
  },
]
const Services = () => {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-5 sm:px-10 md:px-12 lg:px-5 flex flex-col items-center gap-10 xl:gap-14">
        <div className="text-center max-w-3xl mx-auto space-y-4 z-1">
          <h1 className="text-gray-900 dark:text-white font-semibold text-4xl">
            What can I offer?
          </h1>
          <p className="text-gray-700 dark:text-gray-300">
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </p>
        </div>
        <div className="relative grid sm:grid-cols-2 lg:grid-cols-3 gap-6 z-1 w-3/4">
          {services.map(service => (
            <ServiceCard key={service.id} {...service} />
          ))}
          <div className="absolute w-[70%] h-[300px] rounded-2xl -z-1 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{backgroundSize: "200% auto", backgroundImage: "linear-gradient(-45deg,red,blue)"}}/>
        </div>
      </div>
    </section>
  )
}

export default Services
