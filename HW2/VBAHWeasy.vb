Sub easy()

    TotalVolYear
    
End Sub

Function TotalVolYear()

    'Declaration of variable: sum accumulates stock volume per row for given ticker value,
    'and ticker/previous_ticker keeps track of ticker value
    Dim sum As Double
    Dim ticker As String
    Dim previous_ticker As String
    Dim lastrow As Double
    'j is the row index for the results
    Dim j As Integer
    Dim Allsheets As Integer
    
    'Counts number of sheets
    Allsheets = Application.Sheets.Count

    'Goes to first sheet in workbook
    Sheets(1).Select

    'This loops executes the task from sheet 1 until final sheet in workbook
    For Sheet = 1 To Allsheets

        'Column titles for the variables we wish to extract: The total stock volume, and the correspoding Ticker value
        Range("I1").Value = "Ticker"
        Range("L1").Value = "Total Stock Volume"

        'Initializing variables
        j = 2
        sum = 0
        previous_ticker = Range("A2").Value
        Cells(j, 9).Value = previous_ticker
        lastrow = Cells(Rows.Count, 1).End(xlUp).Row

        
        'This loop checks the ticker value of each row, and accordingly sums the stock volume
        For Row = 2 To lastrow
            ticker = Cells(Row, 1).Value

            'This statement checks that ticker value HASN'T changed since previous row
            If ticker = previous_ticker Then
                sum = sum + Cells(Row, 7)
            
                'When checking the last row, print the sum (no next row to compare ticker)
                If Row = lastrow Then
                    Cells(j, 12) = sum
                End If
            
            'If ticker value HAS changed, print the previous ticker value and the sum in the results columns
            Else

                'Prints sum
                Cells(j, 12).Value = sum

                'Next row in results columns
                j = j + 1

                Cells(j, 9).Value = ticker
                
               
                previous_ticker = ticker
                
                'Reset sum to 0 and carry on
                sum = 0
                sum = sum + Cells(Row, 7)
            End If
        Next Row

        'Goes to the next sheet
        If Sheet <> Allsheets Then
            ActiveSheet.Next.Select
        End If

    Next Sheet


End Function

