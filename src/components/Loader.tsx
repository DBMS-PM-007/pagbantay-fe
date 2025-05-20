type LoaderProps = {
  text: string
}

export default function Loader({ text }: LoaderProps) {
  return <h1>Loading {text}...</h1>;
}

