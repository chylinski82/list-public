const Header = ({ currentList, setCurrentList, lists }) => {

    return (
    <header>
        <span className="material-icons"
              onClick={() => {
                const index = lists.indexOf(currentList);
                index !== 0 ? setCurrentList(lists[index - 1]) : setCurrentList(lists[lists.length - 1]);
                console.log(lists.indexOf(currentList));
              }}>arrow_back_ios</span>
        <span>{ currentList }</span>                       
        <span className="material-icons"
              onClick={() => {
                const index = lists.indexOf(currentList);
                index !== lists.length - 1 ? setCurrentList(lists[index + 1]) : setCurrentList(lists[0]);
              }}>arrow_forward_ios</span>
    </header>
    )
}

export default Header