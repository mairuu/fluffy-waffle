import { putProjectInfoUseCase } from '~/domain/use-cases';
import { useProject } from '~/ui/shared/hooks';

export const useProjectPresentator = (projectId: number) => {
  const { project, isError, isLoading } = useProject(projectId);
  const toggleFavorite = () => {
    if (!project || isError || isLoading) return;

    const info = { ...project.info };
    info.favorite = !info.favorite;

    putProjectInfoUseCase(info);
  };

  console.log(project);

  return { project, isError, isLoading, toggleFavorite };
};
