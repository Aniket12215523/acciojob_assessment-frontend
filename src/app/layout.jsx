import '../styles/global.css';
import { AuthProvider } from '@/context/AuthContext'; 
import { ModelProvider } from '@/context/ModelContext';

const RootLayout = ({ children }) => {
  return (
    <html lang='en'>
      <head />
      <body className='bg-gray-50 text-gray-900'>
        <AuthProvider>
           <ModelProvider>
          {children}
          </ModelProvider>
        </AuthProvider>
      </body>
    </html>
  );
};

export default RootLayout;
