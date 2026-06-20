const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <p className="text-sm">
          © {new Date().getFullYear()} ShopEase. Built with React, Node.js & MongoDB.
        </p>
      </div>
    </footer>
  );
};

export default Footer;