"use client"
import EditProjectForm from "@/components/project/edit/EditProjectForm";

const EditProjectPage = ({ params }: { params: { projectId: string } }) => {
    return (
        <EditProjectForm projectId={params.projectId} />
    )
}

export default EditProjectPage; 