import { useRouter } from "next/router";

const Language: React.FC = () => {
  const router = useRouter();
  const { locale, pathname, asPath, query } = router;

  const handleLanguageChange = (event: { target: { value: string } }) => {
    // get new locale from event and push it to the router
    const newLocale = event.target.value;
    router.push(
      {
        pathname,
        query,
      },
      asPath,
      { locale: newLocale }
    );
  };

  return (
    <div>
      <select
        id="language"
        className="ml-2 p-1 border-2 border-2 border-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
        value={locale}
        onChange={handleLanguageChange}
      >
        <option value="en">English</option>
        <option value="nl">Nederlands</option>
      </select>
    </div>
  );
};

export default Language;
