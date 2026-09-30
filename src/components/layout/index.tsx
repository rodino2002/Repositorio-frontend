import Layout from "./layout";

export function DefaultLayout({ children }: { children?: React.ReactNode }) {

  return (
    <div
    className={`h-screen "xl:w-[26rem] 2xl:w-20 xl:w-20"
    } transition-all duration-300`}
    >
        <Layout >
           { children }
        </Layout>
    </div>
);
}