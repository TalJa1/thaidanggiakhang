import { Link } from "react-router-dom";
import type { ImageName } from "../config/media";
import { firstSentence, HOME, type Project } from "../data/content";
import MiniAnim from "../sims/MiniAnim";
import DotList from "./DotList";
import { ArrowRight } from "./Icons";
import Img from "./Img";
import Reveal from "./Reveal";

interface Props {
  project: Project;
  name: string;
  image: ImageName;
  index: number;
  alt: string;
}

export default function ProjectCard({ project, name, image, index, alt }: Props) {
  const titleId = `card-${project.id}`;
  return (
    <Reveal as="article" className={`pcard pcard--${index % 2 ? "b" : "a"}`} delay={(index % 2) * 120}>
      <div className="pcard__media">
        <Img name={image} alt={alt} ratio="16 / 10" sizes="(min-width: 900px) 45vw, 100vw" />
        <span className="pcard__num" aria-hidden="true">
          {project.num}
        </span>
        <MiniAnim kind={project.id} />
        <span className="pcard__c pcard__c--tl" aria-hidden="true" />
        <span className="pcard__c pcard__c--br" aria-hidden="true" />
      </div>
      <div className="pcard__body">
        <p className="pcard__field">
          <DotList text={project.fields} />
        </p>
        <h3 className="pcard__title" id={titleId}>
          {name}
        </h3>
        <p className="pcard__desc">{firstSentence(project.description)}</p>
        <Link to={`/research#${project.id}`} className="btn btn--ghost btn--sm" aria-describedby={titleId}>
          <span className="btn__label">{HOME.cardButton}</span>
          <ArrowRight />
        </Link>
      </div>
    </Reveal>
  );
}
