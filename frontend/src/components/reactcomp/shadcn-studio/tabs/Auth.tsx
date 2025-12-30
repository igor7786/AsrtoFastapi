import { useState, useEffect, Suspense, lazy } from 'react';
import { BorderBeam } from '@rcomp/magicui/border-beam';
import {
  Tabs,
  TabsContent,
  TabsContents,
  TabsList,
  TabsTrigger,
} from '@rcomp/shadcn-studio/ui/motion-tabs';
import { LoginForm } from '@rcomp/auth-forms/LoginForm';
import { RegisterForm } from '@rcomp//auth-forms/RegisterForm';
import { motion } from 'motion/react';
import ThemeToggleShell from '@rcomp/theme-toggle-button/ThemeModeToogle';
import FullPageLoader from '@rcomp/skeleton-dashboard-page';
// Lazy-load forms
const LoginFormLazy = lazy(() =>
  import('@rcomp/auth-forms/LoginForm').then((m) => ({ default: m.LoginForm }))
);
const RegisterFormLazy = lazy(() =>
  import('@rcomp/auth-forms/RegisterForm').then((m) => ({ default: m.RegisterForm }))
);
const tabs = [
  {
    name: 'Sign In',
    value: 'signin',
    content: <LoginFormLazy />,
  },
  {
    name: 'Sign Up',
    value: 'signup',
    content: <RegisterFormLazy />,
  },
];

const TabsAuth = ({ props }: { props: string }) => {
  const [activeTab, setActiveTab] = useState(props); // track current tab

  // Update URL whenever activeTab changes
  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set('tab', activeTab);
    window.history.replaceState({}, '', url);
  }, [activeTab]);

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="mx-auto flex min-h-full w-full max-w-md flex-col items-center">
        <Suspense fallback={<FullPageLoader props={'Auth'} />}>
          <ThemeToggleShell className="absolute top-4 right-4 hidden md:inline-flex" />
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 1 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <Tabs
              value={activeTab}
              onValueChange={(val) => setActiveTab(val)}
              className="mx-auto w-full gap-6"
            >
              <TabsList className="bg-background/80 w-full justify-center shadow-md">
                {tabs.map((tab) => (
                  <TabsTrigger key={tab.value} value={tab.value}>
                    {tab.name}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContents className="bg-background sm:bg-muted mx-1 -mt-2 mb-1 rounded-lg shadow-md">
                {tabs.map((tab) => (
                  <TabsContent className="min-h-full" key={tab.value} value={tab.value}>
                    {tab.content}
                    <BorderBeam
                      duration={8}
                      size={150}
                      borderWidth={2}
                      className="from-transparent to-transparent"
                    />
                  </TabsContent>
                ))}
              </TabsContents>
            </Tabs>
          </motion.div>
        </Suspense>
      </div>
    </div>
  );
};

export default TabsAuth;
