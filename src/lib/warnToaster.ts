import toast from "react-hot-toast"

const warn = (msg: string) => {
  return toast(msg, {
    icon: '⚠️'
  })
}

export default warn