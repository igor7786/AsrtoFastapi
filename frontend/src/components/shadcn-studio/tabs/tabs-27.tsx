import { BorderBeam } from '@/components/reactcomp/magicui/border-beam';
import {
  Tabs,
  TabsContent,
  TabsContents,
  TabsList,
  TabsTrigger,
} from '@/components/reactcomp/ui/motion-tabs';
import { LoginForm } from '@rcomp/LoginForm';
const tabs = [
  {
    name: 'Login',
    value: 'explore',
    content: (
      <>
        <LoginForm />
      </>
    ),
  },
  {
    name: 'Favorites',
    value: 'favorites',
    content: (
      <div className="p-4 text-2xl">
        All your <span className="text-foreground font-semibold">favorites</span> are saved here. Revisit
        articles, collections, and moments you love, any time you want a little inspiration.
      </div>
    ),
  },
];

const AnimatedTabsDemo = () => {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center">
      <Tabs defaultValue="explore" className="mx-auto w-full gap-6">
        <TabsList className="w-full justify-center bg-background/50 shadow-md">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.name}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContents className="mx-1 -mt-2 mb-1 rounded-lg shadow-md ">
          {tabs.map((tab) => (
            <TabsContent key={tab.value} value={tab.value}>
              <div className="bg-background text-muted-foreground text-sm">{tab.content}</div>
              <BorderBeam
                duration={8}
                // delay={3}
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
