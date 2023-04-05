import Header from './header';

export default function Layout({children, title}) {
  return (
    <>
      <Header title={title} />
      <main>{children}</main>
    </>
  )
}