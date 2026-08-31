const PageContainer = ({ children }) => {
  return (
    <main className="min-h-[calc(100vh-5rem)] bg-rji-background">
      <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {children}
      </div>
    </main>
  );
};

export default PageContainer;