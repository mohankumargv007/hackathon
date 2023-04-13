import Header from './header';
import Footer from './footer';

export default function Layout({children, title, footer}) {
  return (
    <>
      <Header title={title} />
      <main>{children}</main>
      <Footer footer={footer} />
    </>
  )
}