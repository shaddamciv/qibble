import { DynamicWidget } from '@dynamic-labs/sdk-react-core';

function Header() {
  return (
    <header className="navbar mb-2 shadow-lg bg-neutral text-neutral-content">
      <div className="px-2 mx-2 navbar-start">
        <span className="text-lg font-bold">
          Qibble
        </span>
      </div> 
      <div className="navbar-end">
        <DynamicWidget />
      </div>
    </header>
  );
}

export default Header;