import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";

import { OverViewCard } from "@/components/overViewCard";
import { LinkProp } from "@/types";
import { LinkCard } from "@/components/linkCard";
export default function DocsPage() {
  const mockLinks: LinkProp[] = [
    {
      id: 1,
      title: "Google",
      url: "https://google.com",
      description: "Search the world's information.",
      createdAt: "2024-02-22T10:30:00Z",
      userId: "user_1",
      isShared: true,
    },
    {
      id: 2,
      title: "GitHub",
      url: "https://github.com",
      description: "Where the world builds software.",
      createdAt: "2024-02-21T14:15:00Z",
      userId: "user_2",
      isShared: false,
    },
    {
      id: 3,
      title: "Hacker News",
      url: "http://news.ycombinator.com",
      description: "Tech news and startup discussions.",
      createdAt: "2024-02-20T18:00:00Z",
      userId: "user_3",
      isShared: true,
    },
    {
      id: 4,
      title: "Reddit",
      url: "https://reddit.com",
      description: "The front page of the internet.",
      createdAt: "2024-02-19T09:45:00Z",
      userId: "user_4",
      isShared: true,
    },
    {
      id: 5,
      title: "OpenAI",
      url: "https://openai.com",
      description: "AI research and advancements.",
      createdAt: "2024-02-18T12:00:00Z",
      userId: "user_5",
      isShared: false,
    },
  ];

  return (
    <section>
      <div className="w-full flex justify-start items-center gap-2">
        <OverViewCard count={269} name="Bookmarks" />
        <OverViewCard count={69} name="Shared Bookmarks" />
      </div>
      <div className="my-4">
        <Card className="w-full py-1 min-h-96">
          <CardHeader className="pb-0">
            <small className="text-default-500">Recently Added</small>
          </CardHeader>
          <CardBody className="py-2">
            {mockLinks.map((item, index) => (
              <LinkCard key={index} {...item} />
            ))}
          </CardBody>
          <CardFooter className="pt-0 m-0">
            <Button className="w-full text-default-500" variant="light">
              View All
              <RightArrow className="text-default-500 size-5" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}

const RightArrow = ({ className, ...props }: { className?: string }) => {
  return (
    <svg
      className={className}
      {...props}
      fill="none"
      height="24"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
};
