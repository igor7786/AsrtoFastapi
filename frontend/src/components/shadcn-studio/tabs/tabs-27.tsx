import { useState, useEffect } from 'react';
import { BorderBeam } from '@/components/reactcomp/magicui/border-beam';
import {
  Tabs,
  TabsContent,
  TabsContents,
  TabsList,
  TabsTrigger,
} from '@/components/reactcomp/ui/motion-tabs';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

const tabs = [
  {
    name: 'Sign In',
    value: 'signin',
    content: <LoginForm />,
  },
  {
    name: 'Sign Up',
    value: 'signup',
    content: <RegisterForm />,
  },
];

const AnimatedTabsDemo = ({ props }: { props: string }) => {
  const [activeTab, setActiveTab] = useState(props); // track current tab

  // Update URL whenever activeTab changes
  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set('tab', activeTab);
    window.history.replaceState({}, '', url);
  }, [activeTab]);

  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center">
      <Tabs
        value={activeTab}
        onValueChange={(val) => setActiveTab(val)}
        className="mx-auto w-full gap-6"
      >
        <TabsList className="bg-background/50 w-full justify-center shadow-md">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.name}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContents className="mx-1 -mt-2 mb-1 rounded-lg shadow-md">
          {tabs.map((tab) => (
            <TabsContent key={tab.value} value={tab.value}>
              <div className="bg-background text-muted-foreground text-sm">{tab.content}</div>
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
    </div>
  );
};

export default AnimatedTabsDemo;
