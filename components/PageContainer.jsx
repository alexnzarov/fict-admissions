import Head from "next/head";
import Navbar from "./Navbar";

const PageContainer = ({ pageTitle, title, subtitle, children }) => {
  const pageSubtitle = subtitle ?? title;
  return (
    <div className="page-container">
      <Head>
        <title>{pageTitle ?? title}</title>
        <meta key="viewport" name="viewport" content="width=device-width, initial-scale=1"></meta>
      </Head>
      <Navbar />
      <div className="main-content container">
        <header style={{ marginBottom: subtitle ? '3em' : '1em'  }}>
          {
            subtitle &&
            <h1 className="title">{title}</h1>
          }
          <p className="subtitle is-4">{pageSubtitle}</p>
        </header>
        {children}
      </div>
    </div>
  );
};

export default PageContainer;