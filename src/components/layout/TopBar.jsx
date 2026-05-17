export default function TopBar() {
  return (
    <div className="bg-black text-center text-sm text-white">
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-center gap-2 px-4 py-2.5 sm:justify-between">
        <p className="flex flex-wrap items-center justify-center gap-1">
          <span className="hidden sm:inline">
            Summer Sale For All Swim Suits And Free Express Delivery — OFF 50%!
          </span>
          <span className="sm:hidden">Summer Sale — OFF 50%!</span>
          <button type="button" className="font-semibold underline underline-offset-2">
            ShopNow
          </button>
        </p>
        <label className="flex cursor-pointer items-center gap-2">
          <span className="sr-only">Language</span>
          <select
            className="rounded border border-white/20 bg-black px-2 py-1 text-sm outline-none"
            defaultValue="en"
          >
            <option value="en">English</option>
            <option value="ur">اردو</option>
          </select>
        </label>
      </div>
    </div>
  )
}
