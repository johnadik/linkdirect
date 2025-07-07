import { createServerClient } from '@supabase/ssr';

     export default async function Home() {
       const supabase = createServerClient(
         process.env.NEXT_PUBLIC_SUPABASE_URL,
         process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
       );

       const { data: links } = await supabase
         .from('redirect_links')
         .select('key, url');

       return (
         <div>
           <h1>Redirect Links</h1>
           <ul>
             {links.map((link) => (
               <li key={link.key}>
                 <a href={`/?1=${link.key}`}>
                   {link.key.charAt(0).toUpperCase() + link.key.slice(1)} Link
                 </a>
               </li>
             ))}
           </ul>
         </div>
       );
     }

     export async function getServerSideProps({ query }) {
       const supabase = createServerClient(
         process.env.NEXT_PUBLIC_SUPABASE_URL,
         process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
       );

       const { redirect } = query;
       if (redirect) {
         const { data } = await supabase
           .from('redirect_links')
           .select('url')
           .eq('key', redirect)
           .single();
         if (data) {
           return {
             redirect: {
               destination: data.url,
               permanent: false,
             },
           };
         }
       }
       return { props: {} };
     }
