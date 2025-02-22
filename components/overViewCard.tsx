import React from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
export const OverViewCard = ({
  name,
  count,
}: {
  name: string;
  count: number;
}) => {
  return (
    <Card className="w-full py-1">
      <CardHeader className="pb-0">
        <small className="text-default-500">{name}</small>
      </CardHeader>
      <CardBody className="py-2">
        <p className="text-large">{count}</p>
      </CardBody>
    </Card>
  );
};
