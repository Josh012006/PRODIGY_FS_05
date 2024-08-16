
export default function ErrorAlert({children} : {children : React.ReactNode}) {
    return(
        <div className = "rounded-lg p-4 mt-3 flex justify-center items-center bg-yellow-300 text-red-700 text-center w-11/12 sm:w-1/4 mx-auto my-4">{children}</div>
    )
}