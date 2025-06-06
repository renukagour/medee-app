// import { checkRole } from '@/utils/roles'
// import { redirect } from 'next/navigation'

// export default async function AdminDashboard() {
//   // Protect the page from users who are not admins
//   const isAdmin = await checkRole('admin')
//   if (!isAdmin) {
//     redirect('/')
//   }

//   return <p>This is the protected admin dashboard restricted to users with the `admin` role.</p>
// }
import { redirect } from 'next/navigation'
import { checkRole } from '@/utils/roles'
import { SearchUsers } from './SearchUsers'
import { clerkClient } from '@clerk/nextjs/server'
import { removeRole, setRole } from './_actions'

export default async function AdminDashboard(params: {
  searchParams: Promise<{ search?: string }>
}) {
  if (!checkRole('admin')) {
    redirect('/')
  }

  const query = (await params.searchParams).search

  const client = await clerkClient()

  const users = query ? (await client.users.getUserList({ query })).data : []

  return (
    <>
      <p>This is the protected admin dashboard restricted to users with the `admin` role.</p>

      <SearchUsers />

      {users.map((user) => {
        return (
          <div key={user.id} className='flex flex-col gap-2 border-2 border-gray-300 rounded-md p-2'>
            <div className='font-bold'>
              {user.firstName} {user.lastName}
            </div>

            <div className='text-sm text-gray-500'>
              { 
                user.emailAddresses.find((email) => email.id === user.primaryEmailAddressId)
                  ?.emailAddress
              }
            </div>

            <div className='text-sm text-gray-500 '>{user.publicMetadata.role as string}</div>

            <form action={setRole} className='mt-2 flex gap-2'>
              <input type="hidden" value={user.id} name="id" />
              <input type="hidden" value="admin" name="role" />
              <button type="submit">Make Admin</button>
            </form>

            <form action={setRole} className='mt-2 flex gap-2'>
              <input type="hidden" value={user.id} name="id" />
              <input type="hidden" value="moderator" name="role" />
              <button type="submit">Make Moderator</button>
            </form>

            <form action={removeRole} className='mt-2 flex gap-2'>
              <input type="hidden" value={user.id} name="id" />
              <button type="submit">Remove Role</button>
            </form>
          </div>
        )
      })}
    </>
  )
}