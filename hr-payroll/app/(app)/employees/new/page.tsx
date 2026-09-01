import { EmployeeForm } from "@/components/employee-form";
import { createEmployee } from "@/app/actions";
import { getMessages } from "@/lib/locale";
export const metadata={title:"Add employee"};
export default async function NewEmployeePage(){const {messages}=await getMessages();return <div className="page page-narrow"><div className="page-header"><div><h1 className="page-title">{messages.employees.add}</h1><p className="page-description">Name, salary and weekly work schedule.</p></div></div><EmployeeForm action={createEmployee} messages={messages}/></div>}
