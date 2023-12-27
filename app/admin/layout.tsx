import AdminNav from "../ components/admin/AdminNav";

export const metadata={
    title:'LuxeGlobal Admin',
    description:'LuxeGlobal Admin Dashboard'
}
const AdminLayout = ({children}:{children:React.ReactNode}) => {
    return ( <div>
      <AdminNav/>
        {children}
    </div> );
}
 
export default AdminLayout;