export default function Widget(props) {
  return(
    <div className="overflow-scroll rounded-lg bg-white dark:bg-slate-800 dark:text-white  shadow-sm w-full h-full p-6">
      <h3 className="font-bold mb-3 text-xl text-blue-900 dark:text-blue-500">{props.title}</h3>
      <p className="text-xs">{props.desc}</p>
      <div className="bg-blue-100 py-10 text-center">
        <div className="">INSERT CHART HERE</div>
      </div>
    </div>
  )
}