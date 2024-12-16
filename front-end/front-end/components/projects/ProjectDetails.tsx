import React, { useEffect, useState } from "react";
import { Project, User } from "types";
import UserOverviewTable from "../users/UserOverViewTable";

type Props = {
  project: Project & { users: { user: User }[] };
};

const ProjectDetails: React.FC<Props> = ({ project }) => {
  return (
    <div>
      <UserOverviewTable project={project} />
    </div>
  );
};

export default ProjectDetails;
