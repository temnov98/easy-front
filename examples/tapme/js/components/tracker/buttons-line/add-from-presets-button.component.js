class AddFromPresetsButtonComponent extends Component {
    toHtml() {
        return t`
            <div class="icon-button icon-button--big" onclick="${() => pageModel.addTasksFromPresets()}">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.71 7.70999L11 5.40999V15C11 15.2652 11.1054 15.5196 11.2929 15.7071C11.4804 15.8946 11.7348 16 12 16C12.2652 16 12.5196 15.8946 12.7071 15.7071C12.8946 15.5196 13 15.2652 13 15V5.40999L15.29 7.70999C15.383 7.80372 15.4936 7.87811 15.6154 7.92888C15.7373 7.97965 15.868 8.00579 16 8.00579C16.132 8.00579 16.2627 7.97965 16.3846 7.92888C16.5064 7.87811 16.617 7.80372 16.71 7.70999C16.8037 7.61703 16.8781 7.50642 16.9289 7.38456C16.9797 7.26271 17.0058 7.132 17.0058 6.99999C17.0058 6.86798 16.9797 6.73727 16.9289 6.61541C16.8781 6.49355 16.8037 6.38295 16.71 6.28999L12.71 2.28999C12.6149 2.19895 12.5028 2.12758 12.38 2.07999C12.1365 1.97997 11.8635 1.97997 11.62 2.07999C11.4972 2.12758 11.3851 2.19895 11.29 2.28999L7.29 6.28999C7.19676 6.38323 7.1228 6.49392 7.07234 6.61574C7.02188 6.73756 6.99591 6.86813 6.99591 6.99999C6.99591 7.13185 7.02188 7.26242 7.07234 7.38424C7.1228 7.50606 7.19676 7.61675 7.29 7.70999C7.38324 7.80323 7.49393 7.87719 7.61575 7.92765C7.73757 7.97811 7.86814 8.00408 8 8.00408C8.13186 8.00408 8.26243 7.97811 8.38425 7.92765C8.50607 7.87719 8.61676 7.80323 8.71 7.70999ZM21 14C20.7348 14 20.4804 14.1053 20.2929 14.2929C20.1054 14.4804 20 14.7348 20 15V19C20 19.2652 19.8946 19.5196 19.7071 19.7071C19.5196 19.8946 19.2652 20 19 20H5C4.73478 20 4.48043 19.8946 4.29289 19.7071C4.10536 19.5196 4 19.2652 4 19V15C4 14.7348 3.89464 14.4804 3.70711 14.2929C3.51957 14.1053 3.26522 14 3 14C2.73478 14 2.48043 14.1053 2.29289 14.2929C2.10536 14.4804 2 14.7348 2 15V19C2 19.7956 2.31607 20.5587 2.87868 21.1213C3.44129 21.6839 4.20435 22 5 22H19C19.7956 22 20.5587 21.6839 21.1213 21.1213C21.6839 20.5587 22 19.7956 22 19V15C22 14.7348 21.8946 14.4804 21.7071 14.2929C21.5196 14.1053 21.2652 14 21 14Z" fill="none"/>
                </svg>
            </div>
        `;
    }
}